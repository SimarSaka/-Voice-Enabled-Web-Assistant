const TOKEN = "mysecret123"; // must match CONTROL_TOKEN in backend/.env

async function post(path, body = {}) {
  const res = await fetch(`http://localhost:3000${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-control-token": TOKEN,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Control request failed");
  return data;
}

export async function openApp(app) {
  return post("/control/open-app", { app });
}

export async function shutdownIn(seconds) {
  return post("/control/shutdown", { seconds });
}

export async function cancelShutdown() {
  return post("/control/shutdown-cancel");
}

export async function sleepPC() {
  return post("/control/sleep");
}
