const apiUrl = "http://localhost:3333/api";

export async function apiHandler(url: string, init?: RequestInit) {
  const request = await fetch(`${apiUrl}${url}`, init);
  if (request.status !== 204) {
    const data = await request.json();
    if (request.status > 299)
      throw Error(
        "Error handling request: " +
          ["Status: " + request.status, "Message: " + data.message].join(", ")
      );
    return data;
  }
}
