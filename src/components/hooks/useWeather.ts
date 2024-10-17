import axios from "axios";
import { z } from "zod";
// import { object, string, number, Output, parse } from "valibot";
import { SearchType } from "../../types";
import { useMemo, useState } from "react";

// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

// Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });

// type Weather = Output<typeof WeatherSchema>;

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>({
    name: "",
    main: {
      temp: 0,
      temp_max: 0,
      temp_min: 0,
    },
  });

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

      const { data } = await axios(geoUrl);

      const lat = data[0].lat;
      const lon = data[0].lon;

      console.log(lat);
      console.log(lon);

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      // const {data: weatherResult} = await axios<Weather>(weatherUrl)
      //  console.log(weatherResult.main)

      // Zod
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data);
      }

      // Valibot
      //   const {data: weatherResult} = await axios(weatherUrl)
      //   const result = parse(WeatherSchema, weatherResult)
      //   if(result) {
      //     console.log(result.name)
      //   }
    } catch (error) {
      console.log(error);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather])

  return {
    weather,
    fetchWeather,
    hasWeatherData
  };
}