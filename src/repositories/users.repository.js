import UserDao from "../dao/mongo/user.dao.js";

export default class UserRepository {
    constructor() {
        this.dao = new UserDao();
    }

    getUserByEmail = async (email) => this.dao.getByEmail(email);
    getUserById = async (id) => this.dao.getById(id);
    createUser = async (data) => this.dao.create(data);
    updateUser = async (id, data) => this.dao.update(id, data);
}