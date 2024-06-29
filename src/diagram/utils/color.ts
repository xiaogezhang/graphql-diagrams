import tinycolor from 'tinycolor2';

/**
 * Used to generate a color that's easy to read on screen for the text for the given 
 * background color. When the background is light color, use "black" for text and 
 * "DeepSkyBlue" for link; if the background is dark color, use "white" for text and
 * "Blue" for link. If color is passed in, just return the passed in color. 
 * 
 * @param isLink 
 * @param color 
 * @param backgroundColor 
 * @returns 
 */
export function getTextColor(
    isLink: boolean,
    color?: string,
    backgroundColor?: string,
  ): string {
    if (color) {
      return color;
    }
    const defaultColor = isLink ? 'RoyalBlue' : 'White';
    if (!backgroundColor) {
      return defaultColor;
    }
    const tinyColor = tinycolor(backgroundColor);
    if (tinyColor.isLight()) {
      return isLink ? 'Blue' : 'Black';
    } else {
      return isLink ? 'DeepSkyBlue' : 'White';
    }
  }