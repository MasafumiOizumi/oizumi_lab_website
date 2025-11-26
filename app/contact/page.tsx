import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Contact
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Get in touch with us.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="flex items-start mb-8">
                            <MapPin className="h-6 w-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Address</h3>
                                <p className="mt-2 text-gray-600">
                                    Oizumi Lab, Department of General Systems Studies,<br />
                                    Graduate School of Arts and Sciences, The University of Tokyo<br />
                                    3-8-1 Komaba, Meguro-ku, Tokyo 153-8902, Japan
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <Mail className="h-6 w-6 text-indigo-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                <p className="mt-2 text-gray-600">
                                    oizumi [at] g.ecc.u-tokyo.ac.jp
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="h-96 w-full bg-gray-200">
                        {/* Embed Google Maps iframe here if needed, using a placeholder for now */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.7479754683745!2d139.6823647152588!3d35.65858048019965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f3542296396f%3A0x7d1d456e8868489c!2sThe%20University%20of%20Tokyo%2C%20Komaba%20Campus!5e0!3m2!1sen!2sjp!4v1620000000000!5m2!1sen!2sjp"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
