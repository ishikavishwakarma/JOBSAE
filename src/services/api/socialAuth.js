export const googleAuthApi = async (accessToken) => {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch Google user info");
  }
  const data = await response.json();
  return data;
};
