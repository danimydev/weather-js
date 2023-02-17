import http from "node:http";
import { RealTimeOptions } from "./types";
import { RealTimeApiResponse } from "./types/real-time-api-response";
import { RealTimeObject } from "./types/real-time-object";

export class Weather {
  private apiKey: string;
  private baseUrl = "http://api.weatherapi.com/v1/current.json";

  constructor(apiKey: string) {
    if (!apiKey || apiKey.length === 0) {
      throw new Error("apiKey must be un-empty string");
    }
    this.apiKey = apiKey;
  }

  async realTime(options: RealTimeOptions) {
    let [[, value]] = Object.entries(options);
    const params = this.buildParams(value).toString();
    const url = new URL(`?${params}`, this.baseUrl);

    const data = await this.fetch(url);

    return {
      requestUrl: url.toString(),
      data: this.parseResponse(data),
    };
  }

  private parseResponse(apiResponse: RealTimeApiResponse): RealTimeObject {
    return {
      lastUpdated: apiResponse.current.last_updated,
      lastUpdatedEpoch: apiResponse.current.last_updated_epoch,
      feelsLike: {
        celcius: apiResponse.current.feelslike_c,
        fahrenheit: apiResponse.current.feelslike_f,
      },
      wind: {
        speed: {
          kph: apiResponse.current.wind_kph,
          mph: apiResponse.current.wind_mph,
        },
        degree: apiResponse.current.wind_degree,
        direction: apiResponse.current.wind_dir,
        gust: {
          kph: apiResponse.current.gust_kph,
          mph: apiResponse.current.gust_mph,
        },
      },
      cloud: apiResponse.current.cloud,
      temperature: {
        celcius: apiResponse.current.temp_c,
        fahrenheit: apiResponse.current.temp_f,
      },
      preassure: {
        inches: apiResponse.current.pressure_in,
        millibars: apiResponse.current.pressure_mb,
      },
      humidity: apiResponse.current.humidity,
      uv: apiResponse.current.uv,
      condition: {
        code: apiResponse.current.condition.code,
        iconUrl: apiResponse.current.condition.icon,
        text: apiResponse.current.condition.text,
      },
      precipitation: {
        inches: apiResponse.current.precip_in,
        millimeters: apiResponse.current.precip_mm,
      },
    };
  }

  private buildParams(qValue: string) {
    const queryParams = new URLSearchParams();
    queryParams.set("key", this.apiKey);
    queryParams.set("q", qValue);
    return queryParams;
  }

  private fetch(url: URL): Promise<RealTimeApiResponse> {
    return new Promise((resolve, reject) => {
      let data = "";

      const req = http.get(url, (res) => {
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("error", (error) => {
          reject(error);
        });

        res.on("end", () => {
          resolve(JSON.parse(data));
        });
      });

      req.end();
    });
  }
}
