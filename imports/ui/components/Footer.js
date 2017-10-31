import React, { Component } from 'react';
import { connect } from 'react-redux';
import { metadataSelector } from '../selectors';
import config from '../config';
import {Button} from 'react-bootstrap';
import { FacebookButton, TwitterButton, GooglePlusButton, PinterestButton, LinkedInButton, RedditButton, VKontakteButton, EmailButton, XingButton, TumblrButton, PocketButton } from "react-social"

class Footer extends Component {

    render() {
        const { metadata } = this.props;
        if (!metadata.get('showFooter')) {
            return <div className="footer">&nbsp;</div>;
        }
        const originalTitle = metadata.getIn(['original', 'title']);
        const originalUrl = metadata.getIn(['original', 'url']);
        let original;
        if (originalTitle !== undefined && originalUrl !== undefined) {
            original = (
                <span className="footer-row">
                    <i className="fa fa-sitemap"></i>&nbsp;
                </span>
            );
        }
        const link = window.location.href;
        var message = metadata.get('title') + " - GEO-C stories ";

        const mediaURL = metadata.get('featured_image');

        return (
            <div className="footer">
                <hr className="footer-sep top-sep" />
                  <span className="footer-row">
                            <i className="fa fa-share-alt"></i>&nbsp;
                            Share this GEO-C story!&nbsp;
                            <FacebookButton title="Share via Facebook" message={message} media={mediaURL} appId={config.faceAPI} url={link} element="a" className="cs-fb">
                                <i className="fa fa-facebook-official"/>
                            </FacebookButton>&nbsp;
                            <TwitterButton title="Share via Twitter" message={message} url={link} element="a" className="">
                                <i className="fa fa-twitter-square"/>
                            </TwitterButton>&nbsp;
                            <GooglePlusButton title="Share via Google+" message={message} url={link} element="a" className="">
                                <i className="fa fa-google-plus-square"/>
                            </GooglePlusButton>&nbsp;
                            <LinkedInButton title="Share via Linkedin" message={message} media={mediaURL} url={link} element="a" className="">
                                <i className="fa fa-linkedin-square"/>
                            </LinkedInButton>&nbsp;
                            <EmailButton title="Share via E-Mail" message={message} url={link} element="a" className="">
                                <i className="fa fa-at"/>
                            </EmailButton>
                  </span>

                  <span className="footer-row">
                        <i className="fa fa-sitemap"></i>&nbsp;
                        <a href={config.geocHomepage}> GEO-C</a> project.
                  </span>
                <span className="footer-row">
                    <i className="fa fa-flask"></i>&nbsp;
                    Made with <a href={config.kajeroHomepage}>Kajero</a>.
                </span>

            </div>
        );
    }

}

export default connect(metadataSelector)(Footer);
