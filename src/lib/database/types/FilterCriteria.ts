export type FilterCriteria = {
    field: string;
    operator: "==" |
    "!=" |
    ">" |
    ">=" |
    "<" |
    "<=" |
    "array-contains" |
    "array-contains-any" |
    "in" |
    "not-in";
    value: any;
};
