import test from 'ava';
import {AssertionError} from 'assert';
import {list, all, map, sorted} from '@aureooms/js-itertools';
import {
	fixedlexicographical,
	quasilexicographical,
	increasing
} from '@aureooms/js-compare';

import sort from '../../../src/array/api/sort';

const limbs = (t, k, M, data) => {
	const result = sort(k, M, data.slice());
	t.true(data.length <= 1 || all(map((tuple) => tuple.length >= k, data)));
	const lex =
		k >= 0
			? fixedlexicographical(increasing, k)
			: quasilexicographical(increasing);
	const expected = sorted(lex, data);
	t.deepEqual(expected, result);
};

limbs.title = (title, k, M, data) =>
	title || `sort(${k}, ${M}, ${JSON.stringify(data)})`;

const throws = (t, k, M, data) => {
	t.throws(() => sort(k, M, data.slice()), {instanceOf: AssertionError});
};

throws.title = (title, k, M, data) =>
	title || `sort(${k}, ${M}, ${JSON.stringify(data)}) ~> throws`;

const singletons = (t, M, data) => limbs(t, 1, M, list(map((x) => [x], data)));
singletons.title = (title, M, data) =>
	limbs.title(title, 1, M, list(map((x) => [x], data)));

// NOP
test(limbs, 0, 0, []);
test(limbs, 1, 0, []);
test(limbs, 2, 0, []);
test(limbs, 0, 2, [[1]]);
test(limbs, 1, 2, [[1]]);
test(limbs, 2, 2, [[1]]);
test(limbs, 0, 2, [[1], [0]]);

// Assertions
test(throws, 2, 2, [[1], [0]]);
test(throws, 3, 3, [
	[2, 1, 3],
	[3, 2, 1],
	[1, 2, 3]
]);

// Degenerates to counting sort
test(singletons, 2, [1, 0]);
test(singletons, 3, [0, 2, 1]);

// General case
test(limbs, 3, 3, [
	[2, 1, 0],
	[0, 2, 1],
	[1, 2, 0]
]);

// Custom radix
test(limbs, 3, 4, [
	[2, 1, 3],
	[3, 2, 1],
	[1, 2, 3]
]);

test('Wikipedia example', limbs, 3, 10, [
	[1, 7, 0],
	[0, 4, 5],
	[0, 7, 5],
	[0, 2, 5],
	[0, 0, 2],
	[0, 2, 4],
	[8, 0, 2],
	[0, 6, 6]
]);

// Variable tuple length
test(limbs, -1, 10, [
	[1, 7, 0],
	[4, 5],
	[7, 5],
	[9, 0],
	[2],
	[8, 0, 2],
	[2],
	[6, 6]
]);
