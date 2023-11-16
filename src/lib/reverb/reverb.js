class UXFDReverb extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'preDelay',
            defaultValue: 0,
            minValue: 0,
            maxValue: sampleRate/4-1,
            automationRate: "k-rate"
        },{
            name: 'bandwidth',
            defaultValue: 0.9999,
            minValue: 0,
            maxValue: 1,
            automationRate: "k-rate"
        },{
            name: 'diffuse',
            defaultValue: 1,
            minValue: 0,
            maxValue: 1,
            automationRate: "k-rate"
        },{
            name: 'decay',
            defaultValue: 0.5,
            minValue: 0,
            maxValue: 1,
            automationRate: "k-rate"
        },{
            name: 'damping',
            defaultValue: 0.005,
            minValue: 0,
            maxValue: 1,
            automationRate: "k-rate"
        },{
            name: 'excursion',
            defaultValue: 16,
            minValue: 0,
            maxValue: 32,
            automationRate: "k-rate"
        },{
            name: 'wet',
            defaultValue: 0.3,
            minValue: 0,
            maxValue: 1,
            automationRate: "k-rate"
        },{
            name: 'dry',
            defaultValue: 0.6,
            minValue: 0,
            maxValue: 1,
            automationRate: "k-rate"
        }]
    }

    constructor(options) {
        super(options); 

        this._Delays    = [];
        this._pDLength  = sampleRate + (128 - sampleRate%128)
        this._preDelay  = new Float32Array(this._pDLength);
        this._pDWrite   = 0;
        this._lp1       = 0.0;
        this._lp2       = 0.0;
        this._lp3       = 0.0;

        [
            0.004771345, 0.003595309, 0.012734787, 0.009307483, 
            0.022579886, 0.149625349, 0.060481839, 0.1249958  , 
            0.030509727, 0.141695508, 0.089244313, 0.106280031
        ].forEach(x => this.makeDelay(x));

        this._taps = Int16Array.from([
            0.008937872, 0.099929438, 0.064278754, 0.067067639, 0.066866033, 0.006283391, 0.035818689, 
            0.011861161, 0.121870905, 0.041262054, 0.08981553 , 0.070931756, 0.011256342, 0.004065724
        ], x => Math.round(x * sampleRate));
    }

    makeDelay(length) { 
        // len, array, write, read
        let len = Math.round(length * sampleRate);
        this._Delays.push([ len, new Float32Array(len), len - 1, 0 ]);
    }

    writeDelay(index, data) {
        this._Delays[index][1][this._Delays[index][2]] = data;
    }

    readDelay(index) {
        return this._Delays[index][1][this._Delays[index][3]];
    }

    readDelayAt(index, i) {
        return this._Delays[index][1][(this._Delays[index][3] + i)%this._Delays[index][0]];
    }

    // readDelayAt Linear Interpolated
    readDelayLAt(index, i) {
        let d = this._Delays[index];
        let curr = d[1][(d[3] + ~~i)%d[0]];
        return curr + (i-~~i++) * (d[1][(d[3] + ~~i)%d[0]] - curr);
    }

    readPreDelay(index) {
        return this._Delays[index][1][this._Delays[index][2]];
    }

    // Only accepts one input, two channels.
    // Spits one output, two channels.
    process(inputs, outputs, parameters) {
        let pd = ~~parameters.preDelay[0]                ,
            bw = parameters.bandwidth[0]                 ,
            fi = parameters.diffuse[0] * 0.75            , 
            si = parameters.diffuse[0] * 0.625           ,
            dc = parameters.decay[0]                     ,
            ft = parameters.diffuse[0] * 0.76            ,
            st = Math.min(Math.max(dc + 0.15, 0.25), 0.5),
            dp = parameters.damping[0]                   ,
            ex = parameters.excursion[0]                 ,
            we = parameters.wet[0]            * 0.6      , // lo and ro are both multiplied by 0.6 anyways
            dr = parameters.dry[0]                       ;

        let lIn		= inputs[0][0],
            rIn		= inputs[0][1],
            lOut	= outputs[0][0],
            rOut	= outputs[0][1];

		// write to predelay and dry output
		if (inputs[0].length == 2) {
			for (let i = 127; i >= 0; i--) {
				this._preDelay[this._pDWrite + i] =
					(inputs[0][0][i] + inputs[0][1][i]) * 0.5;

				outputs[0][0][i] = inputs[0][0][i] * dr;
				outputs[0][1][i] = inputs[0][1][i] * dr;
			}
		} else if (inputs[0].length > 0) {
			this._preDelay.set(inputs[0][0], this._pDWrite);
			for (let i = 127; i >= 0; i--)
				outputs[0][0][i] = outputs[0][1][i] = inputs[0][0][i] * dr;
		} else {
			this._preDelay.set(new Float32Array(128), this._pDWrite);
		}


        // write to predelay
        if (inputs[0].length != 0) {
            this._preDelay.set(inputs[0][0], this._pDWrite);
		} else {
			this._preDelay.fill(0, this._pDWrite, this._pDWrite + 128);
		}
        // this._preDelay.set(Float32Array.from(inputs[0][0], (n, i) => (n + inputs[0][1][i]) * 0.5), this._pDWrite);

        let i = 0;
        while (i < 128) {
            let lo = 0.0,
                ro = 0.0;

            this._lp1 = this._preDelay[(this._pDLength + this._pDWrite - pd + i)%this._pDLength] * bw + (1 - bw) * this._lp1;

            // Please note: The groupings and formatting below does not bear any useful information about 
            //              the topology of the network. I just want orderly looking text.

            // pre
            this.writeDelay(0,                              this._lp1          - fi * this.readDelay(0) );
            this.writeDelay(1, fi * (this.readPreDelay(0) - this.readDelay(1)) +      this.readDelay(0) );
            this.writeDelay(2, fi *  this.readPreDelay(1) + this.readDelay(1)  - si * this.readDelay(2) );
            this.writeDelay(3, si * (this.readPreDelay(2) - this.readDelay(3)) +      this.readDelay(2) );

            let split       =  si *  this.readPreDelay(3) + this.readDelay(3);

            // 1Hz (footnote 14, pp. 665)
            let excursion   =  ex * (1 + Math.cos(currentTime*6.28)); 
            
            // left
            this.writeDelay( 4, split +       dc * this.readDelay(11)             + ft * this.readDelayLAt(4, excursion) ); // tank diffuse 1
            this.writeDelay( 5,                    this.readDelayLAt(4, excursion)- ft * this.readPreDelay(4)            ); // long delay 1
            this._lp2        =          (1 - dp) * this.readDelay(5)              + dp * this._lp2                        ; // damp 1
            this.writeDelay( 6,               dc * this._lp2                      - st * this.readDelay(6)               ); // tank diffuse 2
            this.writeDelay( 7,                    this.readDelay(6)              + st * this.readPreDelay(6)            ); // long delay 2

            // right
            this.writeDelay( 8, split +       dc * this.readDelay(7)              + ft * this.readDelayLAt(8, excursion) ); // tank diffuse 3
            this.writeDelay( 9,                    this.readDelayLAt(8, excursion)- ft * this.readPreDelay(8)            ); // long delay 3
            this._lp3        =          (1 - dp) * this.readDelay(9)              + dp * this._lp3                        ; // damper 2
            this.writeDelay(10,               dc * this._lp3                      - st * this.readDelay(10)              ); // tank diffuse 4
            this.writeDelay(11,                    this.readDelay(10)             + st * this.readPreDelay(10)           ); // long delay 4

            lo =  this.readDelayAt( 9, this._taps[0])
                + this.readDelayAt( 9, this._taps[1])
                - this.readDelayAt(10, this._taps[2])
                + this.readDelayAt(11, this._taps[3])
                - this.readDelayAt( 5, this._taps[4])
                - this.readDelayAt( 6, this._taps[5])
                - this.readDelayAt( 7, this._taps[6]);

            ro =  this.readDelayAt( 5, this._taps[7])
                + this.readDelayAt( 5, this._taps[8])
                - this.readDelayAt( 6, this._taps[9])
                + this.readDelayAt( 7, this._taps[10])
                - this.readDelayAt( 9, this._taps[11])
                - this.readDelayAt(10, this._taps[12])
                - this.readDelayAt(11, this._taps[13]);

            // write
            lOut[i] = lo * we;
            rOut[i] = ro * we;

            if (lIn) {
                lOut[i] += lIn[i] * dr;
                rOut[i] += lIn[i] * dr;
            }
            // lOut[i] = lIn[i] * dr + lo * we;
            // rOut[i] = rIn[i] * dr + ro * we;

            i++;

            for (let j = 0; j < this._Delays.length; j++) {
                let d = this._Delays[j];
                d[2] = (d[2] + 1) % d[0];
                d[3] = (d[3] + 1) % d[0]; 
            }
        }

        // Update preDelay index
        this._pDWrite = (this._pDWrite + 128) % this._pDLength;

        return true;
    }
}

registerProcessor('UXFDReverb', UXFDReverb);
