import {Sequence} from 'remotion';
import {loadFont} from '@remotion/google-fonts/NotoSans';
import {Word} from './Word';
const {fontFamily} = loadFont();

const delayFrames = 40;

const words: WordProps[] = [
	{
		type: 'phonetic',
		phonetic: 'aʊ',
	},
	{
		type: 'definition',
		word: 'now',
		predict: 'ow',
		pronunciation: 'naʊ',
		definitions: ['现在', '即刻'],
	},
	{
		type: 'definition',
		word: 'how',
		predict: 'ow',
		pronunciation: 'haʊ',
		definitions: ['如何', '怎样'],
	},
] as const;

export type WordProps =
	| {
			phonetic: string;
			type: 'phonetic';
	  }
	| {
			type: 'definition';
			word: string;
			pronunciation: string;
			definitions: string[];
			predict: string;
	  };

export const Words = () => {
	return words.map((word, index) => (
		<Sequence
			key={index}
			from={index * delayFrames}
			style={{translate: `0 ${index * 150}px`, color: '#424c50', fontFamily}}
		>
			<Word word={word} />
		</Sequence>
	));
};
