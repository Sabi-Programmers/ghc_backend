const notFound = (req, res) => {
    res.render('error-page', {
        title: 'Page Not Found',
        statusCode: 404,
        message: "Opps, The page you are looking for cant't be found",
    });
};

export default notFound;
