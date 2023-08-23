export interface CoreSemantic {
    units: string;                  // Front-end units to display
    tags: string[];                 // Optional array of tags to associate with data type
    name: string;                   // Front-end name of type
    description: string;            // Front-end description of type
    semantic: string;               // Semantic name for lookup / type casting
    readonly?: boolean;             // Component value cannot be changed by user / generator (overrides randomGenerator setting)
    defaultValue?: any;             // Generic value to insert into component on first render
    nullAllowed?: boolean;          // Type can be sometimes be null (and should be rendered with that in mind)
    randomGenerator?: boolean;      // Generator should produce psuedorandom based on type-specific attributes vs. use the "fixedGeneratorValue"
    fixedGeneratorValue?: any;      // If randomGenerator is false, just report this value as generator result
    renderName?: boolean;           // Display name in component render 
    renderDescription?: boolean;    // Display description in component render
}

export interface OkosSemanticPowerButton extends CoreSemantic {
    isString: boolean;      // Switches from boolean to string enum ["on","off"]
    isToggle?: boolean;     // Render component as toggle instead of single button
}

export type OkosSemanticPowerButtonState = boolean | string // Defining for compile token

export interface OkosSemanticTextEntry extends CoreSemantic {
    isNumber: boolean; //Indicates whether field is raw string or a numeric entry type
    isInteger?: boolean; //Indicates whether field is a floating point or integer numeric type
    min?: number;       //If isNumber, then optional min value
    max?: number;       //If isNumber, then optional max value
    step?: number;      //If isNumber, then optional incremeter step
    pattern?: string;   //If not isNumber, then optional string format enforcer
}

export type OkosSemanticTextEntryState = number | string // Defining for compile token

export interface OkosSemanticRangeEntry extends CoreSemantic {
    isInteger?: boolean; //Indicates whether field is a floating point or integer numeric type
    min?: number;       //If isNumber, then optional min value
    max?: number;       //If isNumber, then optional max value
    step?: number;      //If isNumber, then optional incremeter step
    renderBounds?: boolean; // Display min / max as text
}

export type OkosSemanticRangeState = number // Defining for compile token

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

export type OkosSemanticBooleanState = boolean | string | number // Defining for compile token

export type OkosSemanticEnumSet = Array<string | number> // Type constrained list of options for options

export interface OkosSemanticEnumSelect extends CoreSemantic {
    // Best for selecting one from list (should render as dropdown or radio buttons)
    enumList: OkosSemanticEnumSet;
    isDropdown?: boolean;
}

export type OkosSemanticEnumSelectState = number | string

export interface OkosSemanticEnumSelectMulti extends CoreSemantic {
    // Best for selecting multiple from list (should render as checkboxes)
    enumList: OkosSemanticEnumSet;
}

export type OkosSemanticEnumSelectMultiState = Array<OkosSemanticEnumSelectState>

export interface OkosSemanticColor extends CoreSemantic {
    // Represents color
    range: number;          // Range of values from 0 to this value
    isInteger?: boolean;     // Whether this range of values is integer or float
    renderAlpha?: boolean;   // Optionally render alpha channel control
    renderWhite?: boolean;   // Optionally render white channel control
    renderRGB?: boolean;     // Optionally render color channel controls
}

export interface OkosSemanticColorState {
    // Represents color with core rgb and optional alpha channel and white channel
    r: number;  // Red
    g: number;  // Green
    b: number;  // Blue
    a?: number; // Optional alpha
    w?: number; // Optional white
}

export type OkosSemanticDate = CoreSemantic // Represents date string, no additional render properties

export type OkosSemanticDateState = string   // Represents a formated date-time, date, or time string

export type OkosSemanticTime = CoreSemantic // Represents time string, no additional render properties

export type OkosSemanticTimeState = string   // Represents a formated date-time, date, or time string

export type OkosSemanticDateTime = CoreSemantic // Represents date-time string, no additional render properties

export type OkosSemanticDateTimeState = string   // Represents a formated date-time, date, or time string

export interface OkosSemanticDuration extends CoreSemantic { // Represents some duration after a given date / time
    formAOnly?: boolean; // Only use Form A durations (exclusive with formBOnly)
    formBOnly?: boolean; // Only use Form B durations (exclusive with formAOnly)
}

export interface OkosSemanticDurationDateBounded {      // Form-a for duration, two timestamps
    startTimestamp: string; // String date-time timestamp
    endTimestamp: string;   // String date-time timestamp
}

export interface OkosSemanticDurationNumericBounded {   // Form-b for duration timestamp plus some numeric fractional hours
    timestamp: string;      // String date-time timestamp
    duration: number;       // Numeric representing hours
}

export type OkosSemanticDurationState = OkosSemanticDurationDateBounded | OkosSemanticDurationNumericBounded

export interface CustomSemantic extends CoreSemantic {
    // User defined, stubbed for descriptor
}