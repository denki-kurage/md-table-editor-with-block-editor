import { IStringCounter } from "./interfaces/IStringCounter";
import {  } from '.';

export class StringCounter
{

	public static counter: IStringCounter = str => str.length;

	public static stringCount(str: string): number
	{
		return this.counter(str);
	}

}