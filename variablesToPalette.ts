import rgbToHex from "./rgbToHex";

export default function variablesToPalette(
  variables: Variable[],
  modeId: string | undefined
): Record<string, unknown> {
  if (!modeId) return {};
  const result: Record<string, unknown> = {};
  for (const v of variables) {
    const parts = v.name.split("/");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const value: VariableValue = v.valuesByMode[modeId];
    if (isVariableAlias(value)) {
      const variable = figma.variables.getVariableById(value.id);
      if (variable) {
        current[parts[parts.length - 1]] = variable.name;
      }
      continue;
    }

    if (isRGBA(value)) {
      current[parts[parts.length - 1]] = rgbToHex(value);
    } else {
      current[parts[parts.length - 1]] = value;
    }
  }
  return result;
}

function isRGBA(value: VariableValue): value is RGBA {
  return (
    typeof value === "object" &&
    "r" in value &&
    "g" in value &&
    "b" in value &&
    "a" in value
  );
}

function isVariableAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    "id" in value &&
    value.type === "VARIABLE_ALIAS"
  );
}
