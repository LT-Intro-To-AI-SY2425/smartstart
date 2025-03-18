// function names as a union type
export type FunctionName =
  | "get_available_dates"
  | "get_available_commotities"
  | "get_closest_date_commodity_price"
  | "search_headlines_by_keyword";

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

export interface SearchHeadlinesByKeywordInput {
  keyword: string;
  limit: number;
}

// output types for each function
export type GetAvailableDatesOutput = string[]; // array of ISO date strings
export type GetAvailableCommoditiesOutput = string[]; // array of commodity names
export type GetClosestDateCommodityPriceOutput = [string, number | null]; // [ISO date string, price]
export type SearchHeadlinesByKeywordOutput = {
  headline: string;
  date: string;
  similarity: number;
  link: string;
  political_lean: number;
  matched_publication: string;
}[];

// type map connecting function names to their input/output types
export interface FunctionTypeMap {
  get_available_dates: {
    inputs: GetAvailableDatesInput;
    outputs: { result: GetAvailableDatesOutput };
  };
  get_available_commotities: {
    inputs: GetAvailableCommoditiesInput;
    outputs: { result: GetAvailableCommoditiesOutput };
  };
  get_closest_date_commodity_price: {
    inputs: GetClosestDateCommodityPriceInput;
    outputs: { result: GetClosestDateCommodityPriceOutput };
  };
  search_headlines_by_keyword: {
    inputs: SearchHeadlinesByKeywordInput;
    outputs: { result: SearchHeadlinesByKeywordOutput }; // da code
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
