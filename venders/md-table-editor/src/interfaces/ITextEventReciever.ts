import { IDocumentPosition } from "./IDocumentPosition";

export interface ITextEventRecieverEvent
{
	startPosition: IDocumentPosition;
}

export interface ITextChanged extends ITextEventRecieverEvent
{
	
}

export interface ISelectChanged extends ITextEventRecieverEvent
{
	
}



export interface ITextEventReciever
{
	textChanged(e: ITextChanged): void;
	selectChanged(e: ISelectChanged): void;
	otherChanged(e?: any): void;
}
