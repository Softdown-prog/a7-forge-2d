import { linuxDay, linuxNextMagazineDueDay, LINUX_MAGAZINE_ISSUE_COST, LINUX_MAGAZINE_TITLES, nextLinuxLetter, recordLinuxMail } from "./linuxQuest.js?v=fa1ff35e3337";
import { entrance } from "./simulationState.js?v=fa1ff35e3337";
import { counterQueue } from "./route.js?v=fa1ff35e3337";
import { workerRoute } from "./workerNavigation.js?v=fa1ff35e3337";
import { canTraverseLocalStep } from "./navigation.js?v=fa1ff35e3337";
import { directionFromDelta } from "./direction.js?v=fa1ff35e3337";
import { deliverLinuxMagazineNotice } from "./notices.js?v=fa1ff35e3337";
export const POSTMAN_HANDOFF_MINUTES = 5;
export const postmanDoor = (s) => entrance(s);
export const postmanCounter = (s) => {
    const queue = counterQueue(s);
    // Approach from the customer side of the service desk: no clipping into Tony.
    return { x: queue.x + .48, y: queue.y + .12 };
};
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const money = (n) => Math.round(n * 100) / 100;
const step = (s, job, to, speed) => {
    job.moving = false;
    if (distance(job, to) < .12)
        return true;
    const cachedTarget = job.target;
    if (!cachedTarget || distance(cachedTarget, to) > .15 || !job.route?.length ||
        (s.totalMinutes % 16 === 0)) {
        const route = workerRoute(s, job, to);
        if (!route) {
            job.route = [];
            job.stuck = (job.stuck ?? 0) + 1;
            return false;
        }
        job.route = route;
        job.target = { ...to };
        job.stuck = 0;
    }
    const waypoint = job.route?.[0];
    if (!waypoint)
        return false;
    // A worker route is a sequence of waypoints tested against walls and obstacles.
    if (!canTraverseLocalStep(s, job, waypoint))
        return false;
    const d = distance(job, waypoint);
    const factor = Math.min(1, speed / Math.max(.0001, d));
    const oldX = job.x, oldY = job.y;
    job.x = money(job.x + (waypoint.x - job.x) * factor);
    job.y = money(job.y + (waypoint.y - job.y) * factor);
    const dx = job.x - oldX, dy = job.y - oldY;
    job.moving = distance({ x: 0, y: 0 }, { x: dx, y: dy }) > .001;
    if (job.moving)
        job.facing = directionFromDelta(dx, dy, job.facing ?? "north");
    if (distance(job, waypoint) < .12)
        job.route?.shift();
    return distance(job, to) < .28;
};
function dueIssue(s) {
    const n = s.linuxMagazineIssuesReceived ?? 0;
    if (!s.economyVersion || s.linuxMagazineSubscriptionDay === undefined || n >= 6)
        return null;
    const due = linuxNextMagazineDueDay(s);
    if (due === null || linuxDay(s) < due || s.cash < LINUX_MAGAZINE_ISSUE_COST)
        return null;
    return n;
}
/** Runs once per simulation minute. Keeps the NPC independent of paid staff.
 * A blocked doorway does not magically deliver the issue or charge money.
 */
export function tickPostman(s) {
    let job = s.postmanDelivery;
    if (!job) {
        const n = dueIssue(s);
        if (n === null)
            return;
        const door = postmanDoor(s), counter = postmanCounter(s);
        if (!workerRoute(s, door, counter))
            return;
        job = { issueIndex: n, x: door.x, y: door.y, phase: "arriving", progress: 0,
            facing: "north", moving: false };
        s.postmanDelivery = job;
    }
    if (job.phase === "arriving") {
        if (step(s, job, postmanCounter(s), .34)) {
            job.phase = "handing";
            job.progress = 0;
            job.moving = false;
            job.route = undefined;
            job.target = undefined;
        }
    }
    else if (job.phase === "handing") {
        job.moving = false;
        job.progress++;
        if (job.progress >= POSTMAN_HANDOFF_MINUTES) {
            const magazine = LINUX_MAGAZINE_TITLES[job.issueIndex];
            const letter = nextLinuxLetter(s);
            if (magazine && letter?.id === magazine.id && s.cash >= LINUX_MAGAZINE_ISSUE_COST) {
                const before = s.linuxMagazineIssuesReceived ?? 0;
                recordLinuxMail(s, magazine.id);
                if (s.linuxMagazineIssuesReceived === before + 1) {
                    deliverLinuxMagazineNotice(s, letter.id, letter.title, letter.body.replace("A nova revista impressa chegou da banca!", "O carteiro veio até o balcão, tirou o exemplar da bolsa e o entregou a Tony!"));
                    s.eventLog.unshift("D" + linuxDay(s) + " · Carteiro entregou a revista " +
                        (before + 1) + "/6 a Tony · R$ " + LINUX_MAGAZINE_ISSUE_COST + ".");
                    s.eventLog.splice(14);
                }
            }
            job.phase = "leaving";
            job.progress = 0;
            job.route = undefined;
            job.target = undefined;
        }
    }
    else if (step(s, job, postmanDoor(s), .38)) {
        s.postmanDelivery = undefined;
    }
}
/** A delivery state is small and portable across desktop/mobile saves.
 * Earlier saves do not have postmanDelivery, and start with no actor.
 */
export function validPostmanDelivery(s) {
    const job = s.postmanDelivery;
    if (job === undefined)
        return true;
    if (!job || !Number.isInteger(job.issueIndex) || job.issueIndex < 0 || job.issueIndex >= 6 ||
        !["arriving", "handing", "leaving"].includes(job.phase) ||
        !Number.isInteger(job.progress) || job.progress < 0 || job.progress > POSTMAN_HANDOFF_MINUTES ||
        !Number.isFinite(job.x) || !Number.isFinite(job.y) || Math.abs(job.x) > 100 || Math.abs(job.y) > 100 ||
        (job.route !== undefined && (!Array.isArray(job.route) || job.route.length > 200 ||
            job.route.some(p => !p || !Number.isFinite(p.x) || !Number.isFinite(p.y)))) ||
        (job.target !== undefined && (!Number.isFinite(job.target.x) || !Number.isFinite(job.target.y))) ||
        (job.stuck !== undefined && (!Number.isInteger(job.stuck) || job.stuck < 0 || job.stuck > 1e6)) ||
        (job.facing !== undefined && !["north", "south", "east", "west"].includes(job.facing)) ||
        (job.moving !== undefined && typeof job.moving !== "boolean"))
        return false;
    const count = s.linuxMagazineIssuesReceived ?? 0;
    return s.economyVersion === 2 && s.linuxMagazineSubscriptionDay !== undefined &&
        s.linuxMagazineSubscriptionDay <= linuxDay(s) &&
        (job.phase === "leaving" ? count === job.issueIndex || count === job.issueIndex + 1 : count === job.issueIndex);
}
