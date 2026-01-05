const baseUrl = document.getElementsByTagName('base')[0].href;
const loginUrl = `${baseUrl}Identity/Account/Login`;

export default function followIfLoginRedirect(response) {
  if (response.redirected && response.url.startsWith(loginUrl)) {
    window.location.href = `/login?returnUrl=${window.location.pathname}`;
    // window.location.href = `${loginUrl}?ReturnUrl=${window.location.pathname}`;
  } 

  

  if (response.status === 403) {
    window.location.href = `/not-found`;
  }
}
