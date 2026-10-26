
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function calculateBlackScholes(params) {
  const response = await fetch(
    `${API_BASE_URL}/api/pricing/black-scholes/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}


export async function calculateSensitivities(params) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const response = await fetch(
    `${API_BASE_URL}/api/pricing/black-scholes/sensitivities/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || JSON.stringify(data)
    );
  }

  return data;
}