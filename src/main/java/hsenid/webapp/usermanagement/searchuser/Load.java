package hsenid.webapp.usermanagement.searchuser;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import hsenid.webapp.common.DBCon;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Created by hsenid on 4/27/16.
 */
public class Load extends HttpServlet {

    private static final Logger log = LogManager.getLogger(Load.class);
    String query = null;

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        try {
            int pageNo = Integer.parseInt(request.getParameter("page"));
            int recCount = Integer.parseInt(request.getParameter("recordsCount"));
            connection = DBCon.getComboDataSource().getConnection();
            query = "SELECT * FROM user_cred u,city c WHERE u.cityId=c.ID LIMIT "+recCount+" OFFSET " + recCount * (pageNo - 1) + ";";
            statement = connection.prepareStatement(query);
            resultSet = statement.executeQuery();
            JsonArray jsonArray = new JsonArray();

            while (resultSet.next()) {
                JsonObject jsonObj = new JsonObject();
                jsonObj.addProperty("id", resultSet.getString("ID"));
                jsonObj.addProperty("firstname", resultSet.getString("FirstName"));
                jsonObj.addProperty("lastname", resultSet.getString("LastName"));
                jsonObj.addProperty("country", resultSet.getString("Country"));
                jsonObj.addProperty("city", resultSet.getString("Name"));
                jsonObj.addProperty("dob", resultSet.getString("DOB"));
                jsonObj.addProperty("username", resultSet.getString("UserName"));
                jsonObj.addProperty("email", resultSet.getString("Email"));
                jsonObj.addProperty("tel", resultSet.getString("ContactNo"));
                jsonArray.add(jsonObj);
            }
            out.println(jsonArray);
        } catch (SQLException e) {
            log.error("Error while loading all user details from the database. " + e);
        } finally {
            try {
                if(connection!=null){
                    connection.close();
                }
                if (statement != null) {
                    statement.close();
                }
                if (resultSet != null) {
                    resultSet.close();
                }
            } catch (SQLException e) {
                log.error("Error while closing the common related objects created to load all users. " + e);
            }
        }
    }
}
