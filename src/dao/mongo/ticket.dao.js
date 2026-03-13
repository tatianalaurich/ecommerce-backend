import { TicketModel } from "../../models/ticket.model.js";

export default class TicketDao {
    create = async (data) => {
        return TicketModel.create(data);
    };

    getById = async (id) => {
        return TicketModel.findById(id);
    };
}