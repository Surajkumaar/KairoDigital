import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Clock, CheckCircle } from "lucide-react";
import Aurora from "@/components/ui/aurora";

const portfolioItems = [
	{
		title: "Typography Reel",
		description:
			"Experimental typography designs showcasing brand personality through letterforms and dynamic visual storytelling.",
		image:
			"https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
		category: "Brand Design",
		status: "Case Study in Progress",
		statusIcon: Clock,
		metrics: "150% brand recognition increase",
		tags: ["Typography", "Visual Identity", "Motion Graphics"],
	},
	{
		title: "Carousel Design Concept",
		description:
			"Interactive carousel interfaces that enhance user engagement and content discovery through intuitive design patterns.",
		image:
			"https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
		category: "UX/UI Design",
		status: "Coming Soon",
		statusIcon: Clock,
		metrics: "85% user engagement boost",
		tags: ["UI Design", "Interaction", "User Experience"],
	},
	{
		title: "Thattu Vadai Set Campaign",
		description:
			"Local food brand campaign that increased sales by 200% through authentic storytelling and community-focused marketing.",
		image:
			"https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
		category: "Digital Campaign",
		status: "Full Case Study",
		statusIcon: CheckCircle,
		metrics: "200% sales increase in 3 months",
		tags: ["Strategy", "Social Media", "Content Marketing"],
	},
];

export default function Portfolio() {
	return (
		<section
			id="portfolio"
			className="py-32 relative overflow-hidden"
		>
			{/* Aurora Background Effect */}
			<div className="absolute inset-0 z-0 bg-slate-900/90">
				<Aurora
					colorStops={["#0066ff", "#4d94ff", "#0066ff"]}
					blend={0.7}
					amplitude={1.2}
					speed={0.5}
				/>
			</div>

			{/* Content */}
			<div className="container mx-auto px-6 relative z-10">
				<motion.div
					className="text-center mb-20"
					initial={{ opacity: 0, y: 50 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
				>
					<div className="mb-6">
						<span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium tracking-wide uppercase rounded-full">
							Our Work
						</span>
					</div>
					<h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
						<span className="block text-white">Creative</span>
						<span className="block text-highlight-blue">Excellence</span>
					</h2>
					<p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
						Every project tells a story of transformation. Here's how we've
						helped brands achieve remarkable growth through strategic creativity.
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8 mb-16">
					{portfolioItems.map((item, index) => {
						const StatusIcon = item.statusIcon;
						return (
							<motion.div
								key={index}
								className="group relative"
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.2 }}
								viewport={{ once: true }}
							>
								<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden hover:border-slate-600/50 transition-all duration-500 transform group-hover:-translate-y-4">
									<div className="relative overflow-hidden">
										<img
											src={item.image}
											alt={item.title}
											className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
										<div className="absolute top-4 left-4">
											<span className="inline-block px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-full text-xs text-slate-300 font-medium">
												{item.category}
											</span>
										</div>
										<div className="absolute top-4 right-4">
											<div className="flex items-center space-x-1 px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-full">
												<StatusIcon
													size={12}
													className={`${
														item.status === "Full Case Study"
															? "text-green-400"
															: "text-yellow-400"
													}`}
												/>
												<span className="text-xs text-slate-300 font-medium">
													{item.status}
												</span>
											</div>
										</div>
									</div>

									<div className="p-8">
										<h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-500 transition-colors duration-300">
											{item.title}
										</h3>

										<p className="text-slate-300 mb-6 leading-relaxed">
											{item.description}
										</p>

										<div className="mb-6">
											<div className="text-sm text-slate-400 mb-2">
												Key Result
											</div>
											<div className="text-blue-500 font-semibold">
												{item.metrics}
											</div>
										</div>

										<div className="flex flex-wrap gap-2 mb-6">
											{item.tags.map((tag, tagIndex) => (
												<span
													key={tagIndex}
													className="px-2 py-1 bg-slate-700/50 text-slate-400 text-xs rounded-md"
												>
													{tag}
												</span>
											))}
										</div>

										<div className="flex items-center justify-between">
											<button className="text-white hover:text-blue-400 font-medium text-sm transition-colors duration-300">
												Learn More
											</button>
											<ArrowRight className="text-slate-500 group-hover:text-primary-kairo group-hover:translate-x-2 transition-all duration-300" size={20} />
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Call to Action */}
				<motion.div
					className="text-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
				>
					<div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-3xl p-12">
						<h3 className="text-3xl md:text-4xl font-bold mb-6">
							<span className="text-white">Ready to Create Your</span>
							<span className="text-highlight-blue"> Success Story?</span>
						</h3>
						<p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
							Let's discuss how we can transform your brand's digital presence
							and drive meaningful growth.
						</p>
						<div className="flex flex-col md:flex-row gap-4 justify-center items-center">
							<button
								onClick={() => {
									const element = document.querySelector("#contact");
									if (element)
										element.scrollIntoView({ behavior: "smooth" });
								}}
								className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-kairo to-blue-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
							>
								Start Your Project
								<ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
							</button>
							<button className="group inline-flex items-center px-8 py-4 bg-transparent border-2 border-slate-600 text-slate-300 hover:border-secondary-kairo hover:text-secondary-kairo rounded-full font-semibold transition-all duration-300">
								View Full Portfolio
								<ExternalLink className="ml-2 group-hover:scale-110 transition-transform" size={18} />
							</button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
