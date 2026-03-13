import { UserModel } from "../../models/user.model.js";

export default class UserDao {
    getByEmail = async (email) => {
        return UserModel.findOne({ email });
    };

    getById = async (id) => {
        return UserModel.findById(id);
    };

    create = async (data) => {
        return UserModel.create(data);
    };

    update = async (id, data) => {
        return UserModel.findByIdAndUpdate(id, data, { new: true });
    };
}