import { CharacterModel } from "@/types/vroidAPI.types";

export type retrunType = {
  data: Array<CharacterModel>;
};

async function fetchAPI(
  url: string,
  token: string,
  count: number,
): Promise<retrunType> {
  const result = await fetch(`${url}?count=${count}`, {
    headers: {
      "X-Api-Version": "11",
      Authorization: `Bearer ${token}`,
    },
  });

  return await result.json();
}

export async function getUserPostModel(
  token: string,
  count: number,
): Promise<retrunType> {
  return await fetchAPI(
    "https://hub.vroid.com/api/account/character_models",
    token,
    count,
  );
}

export async function getHeartModel(
  token: string,
  count: number,
): Promise<retrunType> {
  return await fetchAPI("https://hub.vroid.com/api/hearts", token, count);
}

export async function getStaffRecommendModel(
  token: string,
  count: number,
): Promise<retrunType> {
  return await fetchAPI("https://hub.vroid.com/api/staff_picks", token, count);
}

export async function getModelUrl(token: string, modelId: string) {
  const downloadLicense = await fetch(
    `https://hub.vroid.com/api/download_licenses?character_model_id=${modelId}`,
    {
      method: "POST",
      headers: {
        "X-Api-Version": "11",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const downloadLicenseJson = await downloadLicense.json();

  if (!downloadLicenseJson.data.id) {
    throw new Error("downloadLicenseJson.data.id is null");
  }

  const downloadUrl = await fetch(
    `https://hub.vroid.com/api/download_licenses/${downloadLicenseJson.data.id}/download`,
    {
      headers: {
        "X-Api-Version": "11",
        "Accept-Encoding": "gzip",
        Authorization: `Bearer ${token}`,
      },
      redirect: "manual",
    },
  );

  return downloadUrl.headers.get("Location");
}
