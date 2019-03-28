export const emailRule = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/, 'i') // eslint-disable-line
export const fullnameRule = new RegExp(/^[^\^$,`~.|?!@#%^&*\-+=(){}\\\[\]<>\d]+$/, 'i')  // eslint-disable-line

export const usernameRule = new RegExp(/^[a-zA-Z0-9]+$/, 'i')

export const phoneRule = new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/, 'i') // eslint-disable-line

export const fileNameRule = new RegExp(/http.*?com./)

export const timeRule = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)


export const categoryNameRule = new RegExp(/^[^\^$,`~.|?!@#%^&*\-+=(){}\\\[\]<>]+$/, 'i')  // eslint-disable-line

export const slugRule = new RegExp(/^[^\^$,`~.|?!@#%^&*+=(){}\\\[\]<>]+$/, 'i')  // eslint-disable-line
