//登录facebook
async function login(page,username, password) {
    await page.goto('https://www.facebook.com/', {
        timeout: 0
    });
    const elements_username = await page.$("#email");
    await elements_username.focus(); //定位到用户名
    await page.keyboard.type(username);
    const elements_password = await page.$("#pass");
    await elements_password.focus(); //定位到密码
    await page.keyboard.type(password);
    
    const elements_submit = await page.$("#loginbutton");
    console.log(elements_submit);
    // tw
    // const elements_submit = await page.$("*[value='Log In']");
    //cn
    await elements_submit.click();
    await page.waitForSelector("._2qgu._2qgu");
}
//参数有page句柄 和用户名还有密码

module.exports = login;