export default function Footer () {
    return ( <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Luxury Resort Kuta Lombok</h3>
              <p className="text-sm">Experience paradise on Earth</p>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-md font-semibold mb-2">Quick Links</h4>
              <ul className="text-sm">
                <li><a href="#" className="hover:text-gray-300">Home</a></li>
                <li><a href="#" className="hover:text-gray-300">Rooms</a></li>
                <li><a href="#" className="hover:text-gray-300">Amenities</a></li>
                <li><a href="#" className="hover:text-gray-300">Contact</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h4 className="text-md font-semibold mb-2">Contact Us</h4>
              <p className="text-sm">123 Beach Road, Kuta, Lombok, Indonesia</p>
              <p className="text-sm">Phone: +62 123 456 7890</p>
              <p className="text-sm">Email: info@luxuryresortkutalombok.com</p>
            </div>
            <div className="w-full md:w-1/4">
              <h4 className="text-md font-semibold mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; 2023 Luxury Resort Kuta Lombok. All rights reserved.</p>
          </div>
        </div>
      </footer>)
}