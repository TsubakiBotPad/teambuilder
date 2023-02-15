// Source: https://github.com/lukeed/clsx
// License: MIT © Luke Edwards

type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

function toVal(mix: ClassValue) {
	var k, y, str='';

	if (typeof mix === 'string' || typeof mix === 'number') {
		str += mix;
	} else if (typeof mix === 'object') {
		if (Array.isArray(mix)) {
			for (k=0; k < mix.length; k++) {
				if (mix[k]) {
                    y = toVal(mix[k]);
					if (y) {
						str && (str += ' ');
						str += y;
					}
				}
			}
		} else {
			for (k in mix) {
				if (mix?[k] : false) {
					str && (str += ' ');
					str += k;
				}
			}
		}
	}

	return str;
}

export function clsx(...inputs: ClassValue[]): string {
	var i=0, tmp, x, str='';
	while (i < [inputs].length) {
        tmp = [inputs][i++];
		if (tmp) {
			x = toVal(tmp);
			if (x) {
				str && (str += ' ');
				str += x;
			}
		}
	}
	return str;
}

export default clsx;