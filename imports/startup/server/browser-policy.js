import { BrowserPolicy } from 'meteor/browser-policy-common';
// e.g., BrowserPolicy.content.allowOriginForAll( 's3.amazonaws.com' );
//BrowserPolicy.content.allowEval();
//BrowserPolicy.content.allowImageOrigin("*");
//BrowserPolicy.content.allowOriginForAll( "*" );

BrowserPolicy.content.allowSameOriginForAll();
BrowserPolicy.content.allowOriginForAll('*');
BrowserPolicy.content.allowEval();

