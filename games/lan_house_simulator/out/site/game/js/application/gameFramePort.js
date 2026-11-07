/** Domain-facing frame operations and transient feedback, without browser or Canvas. */
import { stepGame } from "../sim/engine.js?v=7be61a7f1436";
import { GAME_LAST_MINUTE } from "../sim/mailCalendar.js?v=7be61a7f1436";
import { dispatchFrameEvents } from "./frameEventDispatch.js?v=7be61a7f1436";
import { createFrameFeedbackPort } from "./frameFeedbackPort.js?v=7be61a7f1436";
import { consumeNewMail, mailBaseline } from "./mailNotifications.js?v=7be61a7f1436";
export function createGameFramePort(getState, audio) {
    const popupQueues = { payments: [], sales: [], speech: [] };
    const feedback = createFrameFeedbackPort(getState, audio, popupQueues);
    let knownMailIds = mailBaseline(getState().notices), previousServed = getState().served, previousPurchases = getState().purchases;
    function beginPlay() { getState().keyboardEffects?.splice(0); knownMailIds = mailBaseline(getState().notices); }
    return {
        popupQueues, beginPlay,
        reset() { beginPlay(); previousServed = getState().served; previousPurchases = getState().purchases; popupQueues.payments.length = 0; popupQueues.sales.length = 0; popupQueues.speech.length = 0; },
        snapshot() { const s = getState(); return { beforeCampaignEnd: s.totalMinutes < GAME_LAST_MINUTE, leftoverMinutes: s.leftoverMinutes }; },
        advance: (minutes) => stepGame(getState(), minutes),
        dispatch(playing, hidden) {
            dispatchFrameEvents({ playing,
                countNewMail: () => consumeNewMail(knownMailIds, getState().notices), isDocumentHidden: () => hidden, notifyMail: () => audio.mail(), feedback,
                updateServed: () => { if (getState().served > previousServed)
                    previousServed = getState().served; },
                updatePurchases: () => { if (getState().purchases > previousPurchases)
                    previousPurchases = getState().purchases; }
            });
        }
    };
}
