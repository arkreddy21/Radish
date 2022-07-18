export const getUser = async () => {
  let response = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
  return await response.json()
};

const refreshToken = async () => {};

