import { NextResponse } from "next/server";

function toPlantMatch(result: any) {
  return {
    commonName: result.species?.commonNames?.[0] ?? null,
    scientificName: result.species?.scientificName ?? null,
    probability: result.score ?? 0,
    gbifId: result.gbif?.id ?? null,
    powoId: result.powo?.id ?? null,
  };
}

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }

    const apiKey = process.env.PLANTNET_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Pl@ntNet API key is not configured." }, { status: 500 });
    }

    const formData = new FormData();
    formData.append("images", new Blob([Buffer.from(image, "base64")], { type: "image/jpeg" }), "image.jpg");
    formData.append("organs", "auto");

    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}&lang=en&nb-results=5`,
      { method: "POST", body: formData }
    );

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Plant identification failed.", details: responseText },
        { status: response.status }
      );
    }

    try {
      const data = JSON.parse(responseText);
      const results = data.results ?? [];
      const topResult = results[0] ?? null;

      return NextResponse.json({
        isPlant: results.length > 0,
        topMatch: topResult
          ? {
              ...toPlantMatch(topResult),
              commonNames: topResult.species?.commonNames ?? [],
              genus: topResult.species?.genus?.scientificName ?? null,
              family: topResult.species?.family?.scientificName ?? null,
            }
          : null,
        alternatives: results.slice(1).map(toPlantMatch),
      });
    } catch {
      return NextResponse.json(
        { error: "Pl@ntNet returned an invalid response.", details: responseText },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Identification error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}