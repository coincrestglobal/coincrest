import React from "react";
import { Link } from "react-router";
import {
  FaTelegramPlane,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-primary-light text-gray-300 pt-10 pb-6 px-6 sm:px-10 lg:px-28">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
        {/* Company Info */}
        <div>
          <Link to="/">
            <img className="h-26 w-40 mb-4" src="/images/logo.png" alt="logo" />
          </Link>
          <p className="text-sm leading-relaxed">
            CoinCrest is your trusted platform to stake USDT and earn passive
            income. Join a secure, transparent, and high-reward crypto
            experience.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-white">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-text-highlighted">
            Stay Connected
          </h4>
          <p className="text-sm mb-4 text-text-body">
            Have questions? We’d love to help!
          </p>
          <div className="flex gap-4 text-md">
            <a
              href="mailto:support@coincrest.io"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-text-highlighted p-2 rounded-full"
            >
              <FaEnvelope color="#12a05b" />
            </a>
            <a
              href="https://t.me/coincrest"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-text-highlighted p-2 rounded-full"
            >
              <FaTelegramPlane color="#12a05b" />
            </a>
            <a
              href="https://twitter.com/coincrest"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-text-highlighted p-2 rounded-full"
            >
              <FaTwitter color="#12a05b" />
            </a>
            <a
              href="https://linkedin.com/company/coincrest"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-text-highlighted p-2 rounded-full"
            >
              <FaLinkedin color="#12a05b" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center text-sm text-gray-500 mt-6">
        © {new Date().getFullYear()} CoinCrest. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
