import models from '../../models'
export async function saveComment(comment: any) {
    return await models.FbComments.create(comment);
}

export async function saveUser(user: any) {
    return await models.FbUser.create(user);
}