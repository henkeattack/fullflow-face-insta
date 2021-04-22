window.flowFacebookData = {
    appId: "",
    clientToken: "",
    loginSuccessFunc: () => {},
    loginFailFunc: () => {},
  };
  export async function performGetOperation(url, headers) {
    const res = await fetch(url, {
      mode: "cors",
      method: "GET",
      headers: headers,
    }).catch(function (error) {
      throw new Error("full-flow-facebook : " + error.message);
    });
  
    return await res.json();
  }
  
  // getAppToken
  export async function getAppToken() {
    const url = `https://graph.facebook.com/oauth/access_token?client_id=${window.flowFacebookData.appId}&client_secret=${window.flowFacebookData.clientToken}&grant_type=client_credentials`;
    let headers = new Headers();
    headers.append("Accept", "application/json");
    return performGetOperation(url, headers);
  }

  // getMyfbAcc
export async function getMyfbAccInfo(instaUserId, accessToken) {
  const url = `https://graph.facebook.com/v10.0/me?fields=id,name,email&access_token=${accessToken}`;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  return performGetOperation(url, headers);
}
// getMyfbAccPage
export async function getMyfbAccPage(instaUserId, accessToken) {
  const url = `https://graph.facebook.com/v10.0/me/accounts?fields=name,id,access_token,engagement,instagram_business_account,followers_count{id}&access_token=${accessToken}`;
  let headers = new Headers();
  headers.append("Accept", "application/json");
  return performGetOperation(url, headers);
}

  // getMyfbPageInsights
  export async function getMyfbPageInsights(instaUserId, accessToken) {
    const url = `https://graph.facebook.com/v10.0/${instaUserId}/insights?metric=page_views_total,page_engaged_users,page_actions_post_reactions_like_total&period=week&access_token=${accessToken}`;
    let headers = new Headers();
    headers.append("Accept", "application/json");
    return performGetOperation(url, headers);
  }

  // getMyfbPagePosts
  export async function getMyfbPagePosts(instaUserId, accessToken) {
    const url = `https://graph.facebook.com/v10.0/${instaUserId}/feed?fields=attachments,type,reach,actions,insights&limit=5&access_token=${accessToken}`;
    let headers = new Headers();
    headers.append("Accept", "application/json");
    return performGetOperation(url, headers);
  }

  // getMyInfo
  export async function getMyInfo(instagramProfileId) {
    FB.api("/me", function (responseData) {
      console.log("getMyInfo", responseData);
      const instaUserId = responseData.id;
      return responseData;
    });
  }
  
  // doLoginSuccessWithCallBack
  export async function doLoginSuccessWithCallBack(yourCallBackFunc) {
    const instaUserId = responseData.authResponse.userID;
    const accessToken = responseData.authResponse.accessToken;
    return yourCallBackFunc && yourCallBackFunc(instaUserId, accessToken);
  }
  
  export function checkLoginState(yourCallBackFunc) {
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        return yourCallBackFunc && yourCallBackFunc(response);
      }
    });
  }
  
  export async function doLoginFail(responseData) {
    // throw new Error("Flow failed Fail" + responseData.status);
    return window.flowFacebookData.loginFailFunc(responseData);
  }
  export async function doLoginSuccess(responseData) {
    const userIdResponse = responseData.authResponse.userID;
    const accessTokenResponse = responseData.authResponse.accessToken;
    return window.flowFacebookData.loginSuccessFunc({
      userIdInfo: userIdResponse,
      accessTokenInfo: accessTokenResponse,
    });
  }
  export function doLogin() {
    FB.login(
      function (response) {
        if (response.status === "connected") {
          // Logged into your webpage and Facebook.
          return doLoginSuccess(response);
          // console.log("response", response);
        }
        return doLoginFail(response);
      },
      { scope: "email,public_profile,pages_show_list, pages_read_engagement,pages_manage_engagement,pages_read_user_content,read_insights" }
    );
  }
  export function initializeFlow() {
    initializeFbScripts();
  }
  
  export function initializeFbScripts() {
    // initalize ------------------->
    window.fbAsyncInit = function () {
      FB.init({
        appId: window.flowFacebookData.appId,
        cookie: true,
        xfbml: true,
        version: "v10.0",
      });
  
      FB.AppEvents.logPageView();
    };
  
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
    // <------------------- initalize
  }  