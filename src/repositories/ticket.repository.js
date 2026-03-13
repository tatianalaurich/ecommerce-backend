import TicketDao from "../dao/mongo/ticket.dao.js";

export default class TicketRepository {
    constructor() {
        this.dao = new TicketDao();
    }

    createTicket = async (data) => {
        return this.dao.create(data);
    };

    getTicketById = async (id) => {
        return this.dao.getById(id);
    };
}