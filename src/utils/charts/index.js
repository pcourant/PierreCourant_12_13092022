// Constants from figma mockups
export function prorataScale(mockupValue, currentChartWidth, mockupChartWidth) {
  return (currentChartWidth * mockupValue) / mockupChartWidth;
}
