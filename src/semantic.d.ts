export interface CoreSemantic {
    semantic: string;           // Semantic name for lookup / type casting
    readonly?: boolean;         // Component value cannot be changed by user / generator (overrides randomGenerator setting)
    label?: string;             // Frontend user-facing description
    annotation?: string;        // Frontend user-facing description
    defaultValue?: any;         // Generic value to insert into component on first render
    nullAllowed?: boolean;      // Type can be sometimes be null (and should be rendered with that in mind)
    randomGenerator?: boolean;  // Generator should produce psuedorandom based on type-specific attributes vs. use the "fixedGeneratorValue"
    fixedGeneratorValue?: any;  // If randomGenerator is false, just report this value as generator result
}

export interface OkosSemanticPowerButton extends CoreSemantic {
    isString: boolean;      // Switches from boolean to string enum ["on","off"]
    isToggle?: boolean;     // Render component as toggle instead of single button
}

export type OkosPowerButton = boolean | string // Defining for compile token

export interface OkosSemanticTextEntry extends CoreSemantic {
    isNumber: boolean; //Indicates whether field is raw string or a numeric entry type
    isInteger?: boolean; //Indicates whether field is a floating point or integer numeric type
    min?: number;       //If isNumber, then optional min value
    max?: number;       //If isNumber, then optional max value
    step?: number;      //If isNumber, then optional incremeter step
    pattern?: string;   //If not isNumber, then optional string format enforcer
}

export type OkosTextEntry = number | string // Defining for compile token

export interface OkosSemanticRangeEntry extends CoreSemantic {
    isInteger?: boolean; //Indicates whether field is a floating point or integer numeric type
    min?: number;       //If isNumber, then optional min value
    max?: number;       //If isNumber, then optional max value
    step?: number;      //If isNumber, then optional incremeter step
}

export type OkosRange = number // Defining for compile token

export interface OkosSemanticBoolean extends CoreSemantic {
    isEnum?: boolean;    // Selects report between boolean or string/number enum
    enumFalse?: string | number; // Value to report when isEnum and isFalse
    enumTrue?: string | number;  // Value to report when isEnum and isTrue
    labelFalse?: string;    // User-facing label for false option
    labelTrue?: string;     // User-facing label for true option
    isToggle?: boolean;     // Render component as toggle instead of single button
    isDropdown?: boolean;   // Render component as drop-down instead of single button
                            // Error if both isToggle and isDropdown
}

export type OkosBoolean = boolean | string | number // Defining for compile token

export type OkosEnumSet = Array<string | number> // Type constrained list of options for options

export interface OkosSemanticEnumSelect extends CoreSemantic {
    // Best for selecting one from list (should render as dropdown [default] or radio buttons)
    enumList: OkosEnumSet;
    isRadioButton?: boolean;
}

export interface OkosSemanticEnumSelectMulti extends CoreSemantic {
    // Best for selecting multiple from list (should render as checkboxes)
    enumList: OkosEnumSet;
}

export type OkosSemanticColor = CoreSemantic // Represents color, no additional render properties

export interface OkosColor {
    // Represents color with core rgb and optional alpha channel and white channel
    r: number;
    g: number;
    b: number;
    a?: number;
    w?: number;
}

export type OkosSemanticDate = CoreSemantic // Represents date string, no additional render properties

export type OkosSemanticTime = CoreSemantic // Represents time string, no additional render properties

export type OkosSemanticDateTime = CoreSemantic // Represents date-time string, no additional render properties

export type OkosTime = string   // Represents a formated date-time, date, or time string

export interface OkosSemanticDuration extends CoreSemantic {
    // Represents some duration after a given date / time
    units?: string;  // default assumed is hours
}

export interface OkosDuration {
    // Represents some duration after a given date / time
    // Either provided as two timestamps or as timestamp and duration
    timestamp?: string;
    duration?: number;
    startTimestamp?: string;
    endTimestamp?: string;
}

export interface CustomSemantic extends CoreSemantic {
    // User defined, stubbed for descriptor
}