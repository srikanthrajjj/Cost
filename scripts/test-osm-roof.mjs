const UA = "CostReno/1.0 (https://costreno.com; roof-estimate@costreno.com)";

async function testAddress(address) {
  const params = new URLSearchParams({
    q: address,
    format: "json",
    limit: "1",
    countrycodes: "us",
    addressdetails: "1",
  });
  const nom = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { Accept: "application/json", "User-Agent": UA },
  });
  console.log("Nominatim status:", nom.status);
  const geo = await nom.json();
  if (!geo[0]) {
    console.log("No geocode result");
    return;
  }
  const lat = geo[0].lat;
  const lng = geo[0].lon;
  console.log("Geo:", lat, lng, geo[0].display_name?.slice(0, 80));

  const query = `[out:json][timeout:25];
(
  way["building"](around:75,${lat},${lng});
  relation["building"](around:75,${lat},${lng});
);
out geom;`;

  for (const base of [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ]) {
    console.log("Trying", base);
    const ov = await fetch(base, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Accept: "application/json",
      "User-Agent": UA,
    },
    body: `data=${encodeURIComponent(query.trim())}`,
  });
    console.log("Overpass status:", ov.status);
    const text = await ov.text();
    if (!ov.ok) {
      console.log("Body preview:", text.slice(0, 120));
      continue;
    }
    const data = JSON.parse(text);
    console.log("Buildings found:", data.elements?.length ?? 0);
    if (data.elements?.[0]?.geometry?.length) {
      console.log("First building points:", data.elements[0].geometry.length);
    }
    break;
  }
}

await testAddress("1600 Pennsylvania Avenue NW, Washington, DC 20500");
