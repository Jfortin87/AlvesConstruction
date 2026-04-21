const isAdmin = (req, res, next) => {
    // LOGS
    console.log("isAdmin - session user:", req.session.user);
    console.log("isAdmin - session id:", req.sessionID);

    if (!req.session.user) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    next();
};

export default isAdmin;