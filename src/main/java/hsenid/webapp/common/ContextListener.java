package hsenid.webapp.common;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.sql.SQLException;

/**
 * Created by hsenid.
 *
 * @author Kasun Dinesh
 */
public class ContextListener implements ServletContextListener {

    // This method will called when the webapp is starting for the first time.
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        PropertyReader propReader = new PropertyReader("system.properties");
        DBCon.createComboDataSource(propReader.readProperty("db.driver"), propReader.readProperty("db.host"), propReader.readProperty("db.database"), propReader.readProperty("db.user"), propReader.readProperty("db.password"));
        try {
            DBCon.getComboDataSource().getConnection();
        } catch (SQLException e) {
        }
    }

    // This method will called when the webapp is closing.
    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        DBCon.closeComboPoolDataSource();
    }
}
