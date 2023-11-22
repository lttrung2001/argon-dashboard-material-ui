export default class ConfirmDeleteData {
    message
    data
    action

    constructor(action, message, data) {
        this.action = action;
        this.message = message;
        this.data = data;
    }
}