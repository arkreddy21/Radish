
export const getUser = async (access: String) => {
  let response = await fetch("https://oauth.reddit.com/api/v1/me", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  })
  return await response.json()
};

const refreshToken = async () => {};

