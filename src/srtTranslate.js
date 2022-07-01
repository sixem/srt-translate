import { writeFile, readFile } from 'fs/promises';
import googleTranslate from './googleTranslate.js';
import Parser from '../vendors/srt-parser-2/index.js';

export default class srtTranslator
{
	constructor(options)
	{
		this.parser = new Parser();
        this.options = options;

		if(!this.options.delay || !Number.isInteger(this.options.delay))
		{
			this.options.delay = 200;
		}

		return this;
	}

	init = async () =>
	{
		this.translator = new googleTranslate(this.options);

		let buffer = await this.getBuffer(this.options.input);
		let parsed = this.parser.fromSrt(buffer.toString());

		await this.processData(parsed).then(async (data) =>
		{
			console.log('\n\nTranslation complete; Writing file ..', '\n\n', '->', this.options.output);
			
			await writeFile(this.options.output, data.join('\n\n'), 'utf8')
		});

		console.log('\n\nTranslation complete.');
	}

	segmentHandler = async (segment, index, total) =>
	{
		return new Promise((resolve, reject) =>
		{
			this.translator.translateText(segment.text, index, total).then((translatedText) =>
			{
				resolve([segment.id, `${segment.startTime} --> ${segment.endTime}`, translatedText].join('\n'));
			}).catch((error) =>
			{
				reject(error);
			});
		});
	}

	processData = async (data) =>
	{
		let [delay, increment, total] = [0, parseInt(this.options.delay), data.length];

		return await Promise.all(data.map((segment, index) =>
		{
			delay = (delay + increment);

			return new Promise(resolve => setTimeout(() =>
			{
				this.segmentHandler(segment, index, total).then((res) =>
				{
					resolve(res);
				}).catch((error) =>
				{
					reject(error);
				});
			}, delay));
		}));
	}

	getBuffer = async (path) =>
	{
		let data = await readFile(path, 'utf8');

		return Buffer.from(data);
	}
};