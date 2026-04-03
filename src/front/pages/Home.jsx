

import "../styles/pages/Home.css";

export const Home = () => {

	return (
		<div className="home-page">
			<div className="container">
				<div className="row justify-content-center align-items-center min-vh-100">
					<div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 text-center">
						<div className="logo-container mb-4">
							<img src="https://res.cloudinary.com/dzvcmydip/image/upload/v1775254377/Logo_de_p%C3%A1gina_de_inicio_vmyrrk.png" alt="Bangover Logo" className="bangover-img img-fluid" />
						</div>
						<div className="pretittle-container mb-2">
							<p>"VINIMOS A PROVOCAR, NO A EDUCAR"</p>
						</div>
						<div className="title-container">
							<h1 className="display-4 fw-bold">BANGOVER</h1>
						</div>
						<div className="description-container mt-3 mb-4">
							<p>PROYECTO NARRRATIVO +18</p>
							<p>BIMESTRAL</p>
						</div>
						<div className="buttons-wrapper">
							<div className="button-container">
								<button type="button" className="btn btn-dark">About Us</button>
								<button type="button" className="btn btn-dark">FC</button>
							</div>
							<div className="button-container facebook-button">
								<button type="button" className="btn btn-dark">
									<i class="fa-brands fa-facebook"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}; 