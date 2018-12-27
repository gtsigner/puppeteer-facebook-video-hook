import axios from 'axios'

const FACHBOOK_FETCH_COMMENTS_URL = '';
export async function comments_fetch(postData: object): Promise<object> {
    //const res=await axios.post(postData)
    const ret = {
        comments: [],
        users: [],
    };

    return {};
}

/**
 * 解析repose数据
 * @param text repose字符
 */
export async function parseCommentsResposeText(text: string) {
    let pst: any = text.replace('for (;;);', '');
    pst = JSON.parse(pst);
    //拿取2个比较重要的信息数据，1：comments，2：profiles
    const comments = pst && pst.jsmods.require[0][3][1].comments.map(it => {
        return {
            text: it.body.text,
            id: it.id,
            fbid: it.id,
            author: it.author,
            date: it.timestamp
        }
    });
    const profiles = pst && pst.jsmods.require[0][3][1].profiles;
    return { comments, profiles }
}