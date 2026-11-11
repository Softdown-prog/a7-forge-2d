export const choice = (id, label, cost, description, outcome, impact) => ({ id, label, cost, description, outcome, impact });
export const story = (title, body, category, choices, good, mixed, bad) => ({ title, body, category, choices, developments: { good, mixed, bad } });
