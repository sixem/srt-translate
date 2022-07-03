import { writeFile, readFile } from 'fs/promises';
import googleTranslate from './googleTranslate.js';
import Parser from '../vendors/srt-parser-2/index.js';

/**
 * srtTranslator class
 */
export default class srtTranslator
{
	constructor(options)
	{
		/** new `Parser` class */
		this.parser = new Parser();
        
		/** setup class */
		this.setup(options);

		/** create new `googleTranslate` class */
		this.translator = new googleTranslate(this.options);

		return this;
	}

	/**
	 * setup the class options
	 * @param {object} options 
	 */
	setup = (options) =>
	{
		/** set options */
        this.options = options;

		/** set a default delay of 200 if `delay` is unset or invalid integer */
		if(!this.options.delay || !Number.isInteger(this.options.delay))
		{
			this.options.delay = 200;
		}

		return this;
	}

	init = async () =>
	{
		/** read and parse input subtitle file */
		let buffer = await this.getBuffer(this.options.input);
		let parsed = this.parser.fromSrt(buffer.toString());

		/** process (translate) the parsed data */
		await this.processData(parsed).then(async (data) =>
		{
			console.log(
				`${this.options.silent ? '' : '\n'}\n` + 
				`Translation complete; Writing file ..\n\n -> ${this.options.output}`
			);
			
			/** attempt to write to output subtitle file */
			await writeFile(this.options.output, data.join('\n\n'), 'utf8').then(() =>
			{
				console.log('\nTranslation complete!');
			}).catch((error) =>
			{
				console.error('\nOutput file could not be saved.', error);
			});
		});

		return this;
	}

	/**
	 * translates a segment (a subtitle line)
	 * 
	 * @param {object} segment 
	 * @param {integer} index 
	 * @param {integer} total 
	 * @returns 
	 */
	segmentHandler = async (segment, index, total) =>
	{
		return new Promise((resolve, reject) =>
		{
			/** send its text to the API for translation */
			this.translator.translateText(segment.text, index, total).then((translatedText) =>
			{
				/** resolve succesfully translated segment */
				resolve([segment.id, `${segment.startTime} --> ${segment.endTime}`, translatedText].join('\n'));
			}).catch((error) =>
			{
				console.error(error);
				
				/** resolve failed translated by returning the untranslated text */
				resolve([segment.id, `${segment.startTime} --> ${segment.endTime}`, segment.text].join('\n'));
			});
		});
	}

	/**
	 * process the input
	 * 
	 * @param {object} data 
	 */
	processData = async (data) =>
	{
		let [delay, increment, total] = [0, parseInt(this.options.delay), data.length];

		/** creates promises with incremented delays */
		return await Promise.all(data.map((segment, index) =>
		{
			delay = (delay + increment);

			return new Promise(resolve => setTimeout(() =>
			{
				/** handle segment */
				this.segmentHandler(segment, index, total).then((res) =>
				{
					/** resolve - segment has been translated */
					resolve(res);
				}).catch((error) =>
				{
					reject(error);
				});
			}, delay));
		}));
	}

	/**
	 * reads buffer from a file
	 * 
	 * @param {string} path 
	 */
	getBuffer = async (path) =>
	{
		let data = await readFile(path, 'utf8');

		return Buffer.from(data);
	}
};