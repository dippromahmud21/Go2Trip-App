export type DestinationOption = {
  id: string;
  city: string;
  country: string;
  region?: string;
  airportCode?: string;
};

export const destinationOptions: DestinationOption[] = [
  { id: "bangkok-th", city: "Bangkok", country: "Thailand", airportCode: "BKK" },
  { id: "tokyo-jp", city: "Tokyo", country: "Japan", airportCode: "HND" },
  { id: "kyoto-jp", city: "Kyoto", country: "Japan" },
  { id: "singapore-sg", city: "Singapore", country: "Singapore", airportCode: "SIN" },
  { id: "bali-id", city: "Bali", country: "Indonesia", region: "Indonesia", airportCode: "DPS" },
  { id: "seoul-kr", city: "Seoul", country: "South Korea", airportCode: "ICN" },
  { id: "london-gb", city: "London", country: "United Kingdom", airportCode: "LHR" },
  { id: "paris-fr", city: "Paris", country: "France", airportCode: "CDG" },
  { id: "rome-it", city: "Rome", country: "Italy", airportCode: "FCO" },
  { id: "barcelona-es", city: "Barcelona", country: "Spain", airportCode: "BCN" },
  { id: "dubai-ae", city: "Dubai", country: "United Arab Emirates", airportCode: "DXB" },
  { id: "istanbul-tr", city: "Istanbul", country: "Turkey", airportCode: "IST" },
  { id: "new-york-us", city: "New York", country: "United States", airportCode: "JFK" },
  { id: "san-francisco-us", city: "San Francisco", country: "United States", airportCode: "SFO" },
  { id: "los-angeles-us", city: "Los Angeles", country: "United States", airportCode: "LAX" },
  { id: "honolulu-us", city: "Honolulu", country: "United States", airportCode: "HNL" },
  { id: "mexico-city-mx", city: "Mexico City", country: "Mexico", airportCode: "MEX" },
  { id: "lisbon-pt", city: "Lisbon", country: "Portugal", airportCode: "LIS" },
  { id: "sydney-au", city: "Sydney", country: "Australia", airportCode: "SYD" },
  { id: "cape-town-za", city: "Cape Town", country: "South Africa", airportCode: "CPT" }
];

export function formatDestination(option: DestinationOption) {
  return `${option.city}, ${option.country}`;
}
