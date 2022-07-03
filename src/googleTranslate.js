import GoogleCloud from '@google-cloud/translate';

/**
 * googleTranslate class
 */
export default class googleTranslate
{
	/**
	 * constructor
	 */
	constructor(options)
	{
		/** setup options */
		this.setup(options);

		/** new translate (v2) class */
		this.translate = new GoogleCloud.v2.Translate();
        
		return this;
	}

	/**
	 * setup options
	 * 
	 * @param {object} options 
	 */
	setup = (options) =>
	{
		/** set `GOOGLE_APPLICATION_CREDENTIALS` */
		process.env.GOOGLE_APPLICATION_CREDENTIALS = options.key;

		/** set options */
        this.options = options;
	}

	/**
	 * translates a line of text
	 * 
	 * @param {string} text 
	 * @param {integer} index 
	 * @param {integer} total 
	 */
	translateText = (text, index, total) =>
	{
		return new Promise((resolve, reject) =>
		{
			/** translate text to target language */
			this.translate.translate(text, this.options.target).then((text) =>
			{
				let [translation] = text;

                if(!this.options.silent)
                {
                    console.log(`Line: ${index + 1} of ${total}`, '->', translation);
                }

				/** resolve translation */
				resolve(translation);
			}).catch((error) =>
			{
				reject(error);
			});
		});
	}
};