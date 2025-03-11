// function names as a union type
export type FunctionName = 
  | "get_available_dates"
  | "get_available_commotities"
  | "get_closest_date_commodity_price"
  | "get_headlines_by_date"
  | "get_headlines_by_keyword";

// input types for each function
export interface GetAvailableDatesInput {
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAvailableCommoditiesInput {}

export interface GetClosestDateCommodityPriceInput {
  name: string;
  year: number;
  month: number;
  day: number;
}

// output types for each function
export type GetAvailableDatesOutput = string[]; // array of ISO date strings
export type GetAvailableCommoditiesOutput = string[]; // array of commodity names
export type GetClosestDateCommodityPriceOutput = [string, number | null]; // [ISO date string, price]

// type map connecting function names to their input/output types
export interface FunctionTypeMap {
  get_available_dates: {
    inputs: GetAvailableDatesInput;
    outputs: GetAvailableDatesOutput;
  };
  get_available_commotities: {
    inputs: GetAvailableCommoditiesInput;
    outputs: GetAvailableCommoditiesOutput;
  };
  get_closest_date_commodity_price: {
    inputs: GetClosestDateCommodityPriceInput;
    outputs: GetClosestDateCommodityPriceOutput;
  };
}

// function call object type
export interface FunctionCall<T extends FunctionName> {
  function_name: T;
  inputs: FunctionTypeMap[T]["inputs"];
  outputs: FunctionTypeMap[T]["outputs"];
}

export interface Message {
  role: "user" | "assistant";
  text: string;
  isNew?: boolean;
  isLoading?: boolean;
  function_calls?: FunctionCall<FunctionName>[];
}

export interface ChatResponse {
  response_text: string;
  user_id?: string;
  title?: string;
  function_calls?: FunctionCall<FunctionName>[];
}
